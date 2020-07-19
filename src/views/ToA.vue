<template>
  <div>
    <div class="grid-container">
      <div class="grid-main">
        <div style="text-align: center; margin-bottom: 16px">
          <img src="../assets/tomb.png" height="450" width="300">
        </div>

        <!--<h1 style="text-align: center; margin-bottom: 16px">Tomb of Annihilation Hex Crawler</h1>-->

        <buefy-drop label="Chance of encounter" id="chance" width="300" :array="chanceArray" @select="onSelect"></buefy-drop>

        <buefy-drop label="Pace" id="pace" width="300" default="1" :array="paceArray" @select="onSelect"></buefy-drop>

        <buefy-drop label="Navigators Wisdom (Survival) Modifier" default="10" id="nav" width="300" :array="navArray" @select="onSelect"></buefy-drop>

        <buefy-drop label="Terrain" id="terrain" width="300" default="1" :array="Object.keys(encounters)" @select="onSelect"></buefy-drop>

        <!--<b-switch style="margin-bottom: 16px; margin-right: 100px" v-model="exposition">More info</b-switch>-->
        <b-field label="Navigation Roll">
          <div class="block">
              <b-checkbox
                  v-model="navAdvantage"
                  native-value="Advantage"
                  type="is-purp"
                  size="is-medium"
                  @input="checkboxClick1">
                  Advantage
              </b-checkbox>
              <b-checkbox
                  v-model="navDisadvantage"
                  native-value="Disadvantage"
                  type="is-purp"
                  size="is-medium"
                  @input="checkboxClick2">
                  Disadvantage
              </b-checkbox>
          </div>
        </b-field>

        <b-field label="Auto Roll Encounter Dice">
          <div class="block">
              <b-checkbox
                  v-model="autoRollCreature"
                  native-value="Creatures"
                  type="is-purp"
                  size="is-medium">
                  Creatures
              </b-checkbox>
              <b-checkbox
                  v-model="autoRollTable"
                  native-value="Tables"
                  type="is-purp"
                  size="is-medium">
                  Tables
              </b-checkbox>
          </div>
        </b-field>

        <button class="button is-medium is-purp" @click="crawl">Crawl</button>

        <div v-if="crawled">
          <hr>
          <p style="margin-bottom: 16px">Weather: {{ weather }}<span v-if="exposition">. {{ weatherInfo[weatherKey] }}</span></p>

          <p style="margin-bottom: 16px">Navigation{{ navRoll }} <span v-html="navigation"></span></p>

          <p style="margin-bottom: 8px">Morning:</p>
          <div v-if="morning.title == 'No encounter'">
            <div style="margin-bottom: 16px" class="card"><div class="card-header"><p class="card-header-title">No encounter</p></div></div>
          </div>
          <div v-else>
            <buefy-card-collapse :title="morning.title" :content="morning.content"></buefy-card-collapse>
          </div>

          <p style="margin-bottom: 8px">Afternoon:</p>
          <div v-if="afternoon.title == 'No encounter'">
            <div style="margin-bottom: 16px" class="card"><div class="card-header"><p class="card-header-title">No encounter</p></div></div>
          </div>
          <div v-else>
            <buefy-card-collapse :title="afternoon.title" :content="afternoon.content"></buefy-card-collapse>
          </div>

          <p style="margin-bottom: 8px">Night:</p>
          <div v-if="night.title == 'No encounter'">
            <div style="margin-bottom: 16px" class="card"><div class="card-header"><p class="card-header-title">No encounter</p></div></div>
          </div>
          <div v-else>
            <buefy-card-collapse :title="night.title" :content="night.content"></buefy-card-collapse>
          </div>

        </div>

        <div v-html="displayEncounter"></div>

      </div>
    </div>
  </div>
</template>

<script>

import { ToAEncounters } from '../data/ToAEncounters.js'
import { ToAEncounterDescriptions } from '../data/ToAEncounterDescriptions.js'
import BuefyDrop from '../components/BuefyDrop.vue'
import BuefyCardCollapse from '../components/BuefyCardCollapse.vue'

export default {
  name: 'ToA',
  components: { BuefyDrop, BuefyCardCollapse },
  data () {
    return {
      navAdvantage: false,
      navDisadvantage: false,
      autoRollCreature: false,
      autoRollTable: false,
      navRoll: '',
      exposition: true,
      crawled: false,
      encounters: ToAEncounters,
      encounterArray: [3, 2, 1],
      chanceArray: ['High', 'Medium', 'Low'],
      paceArray: ['Slow', 'Normal', 'Fast'],
      navArray: ['+10', '+9', '+8', '+7', '+6', '+5', '+4', '+3', '+2', '+1', '0', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10'],
      terrain: null,
      perDay: null,
      chance: null,
      pace: null,
      nav: null,
      displayEncounter: null,
      weather: null,
      weatherKey: null,
      weatherInfo: {
        light: '',
        heavy: 'Visibility limited to 150 feet',
        storm: 'Travel by canoe impossible, travel on foot gains 1 level of exhaustion, DC 10 Constitution save for another. Disadvantage on checks to avoid becoming lost'
      },
      navigation: null,
      morning: {
        title: null,
        content: null
      },
      afternoon: {
        title: null,
        content: null
      },
      night: {
        title: null,
        content: null
      }
    }
  },
  methods: {
    checkboxClick1 () {
      if (this.navAdvantage === true) {
        this.navDisadvantage = false
      }
    },
    checkboxClick2 () {
      if (this.navDisadvantage === true) {
        this.navAdvantage = false
      }
    },
    onSelect (value) {
      this[value.id] = value.value
    },
    crawl () {
      this.rollWeather()

      this.rollNavigation()

      this.rollEncounter('morning')
      this.rollEncounter('afternoon')
      this.rollEncounter('night')

      this.crawled = true

      this.$ga.event('Tools', 'Generation', 'ToACrawl')
    },
    rollEncounter (time) {
      var encounterRoll = this.d20()

      // determine if there is an encounter
      if (this.chance === 'High') {
        if (encounterRoll < 16) {
          this[time].title = 'No encounter'
          this[time].content = null
          return
        }
      } else if (this.chance === 'Medium') {
        if (encounterRoll < 18) {
          this[time].title = 'No encounter'
          this[time].content = null
          return
        }
      } else if (this.chance === 'Low') {
        if (encounterRoll < 20) {
          this[time].title = 'No encounter'
          this[time].content = null
          return
        }
      }

      var terrainRoll = this.d100()
      // determine the encounter for selected terrain

      var terrainEncounters = ToAEncounters[this.terrain]
      for (var key in terrainEncounters) {
        var keyString = String(key)
        var keyArray = []
        if (keyString.includes('-')) {
          var keyRange = keyString.split('-')
          keyArray = this.fillRange(Number(keyRange[0]), Number(keyRange[1]))
        } else {
          keyArray = [Number(keyString)]
        }
        // check if roll matches
        if (keyArray.includes(terrainRoll)) {
          let title = terrainEncounters[keyString].replace(/\b\w/g, l => l.toUpperCase()).replace('(S)', '(s)')
          // title = terrainEncounters['46-47'].replace(/\b\w/g, l => l.toUpperCase()).replace('(S)', '(s)')
          let description = ''
          if (title.includes(',')) {
            var second = title.split(', ')
            description = ToAEncounterDescriptions[second[0]][second[1]].desc
            if (ToAEncounterDescriptions[second[0]][second[1]].hasOwnProperty('table')) {
              description += this.diceList(ToAEncounterDescriptions[second[0]][second[1]].table)
            }
          } else {
            description = ToAEncounterDescriptions[title].desc
            if (ToAEncounterDescriptions[title].hasOwnProperty('table')) {
              description += this.diceList(ToAEncounterDescriptions[title].table)
            }
          }
          // return '<b>' + title + '</b><br>' + description

          description = this.addMonsterLinks(description)

          if (this.autoRollCreature) {
            description = this.addCreatureDice(description)
          }

          this[time].title = title
          this[time].content = description
          return
        }
      }
    },
    rollWeather () {
      var roll = this.d20()
      if (roll < 17) {
        this.weatherKey = 'light'
        this.weather = 'Occasional light rain'
      } else if (roll < 20) {
        this.weatherKey = 'heavy'
        this.weather = 'Heavy rain'
      } else if (roll === 20) {
        this.weatherKey = 'storm'
        this.weather = 'Tropical storm'
      }
    },
    rollNavigation () {
      var dc = 15
      if (this.terrain === 'Beach') {
        dc = 10
      }
      var mod = Number(this.nav)
      var speed = [1, 2]
      var paceString = ''
      if (this.pace === 'Slow') {
        mod += 5
        let speedRoll = this.d6()
        if (speedRoll > 3) {
          speed = [0, 1]
        }
        paceString = '<br>Party can move stealthily.'
      }
      if (this.pace === 'Fast') {
        mod -= 5
        let speedRoll = this.d6()
        if (speedRoll > 3) {
          speed = [2, 3]
        }
        paceString = '<br>-5 to passive perception.'
      }

      var roll = 0
      // handle advantage / disadvantage / none dice roll
      if (this.navAdvantage) {
        this.navRoll = ' with advantage:'
        this.navigation = '<br>'
        // advantage take highest roll
        roll = Math.max(...[this.d20(), this.d20()]) + mod
      } else if (this.navDisadvantage) {
        this.navRoll = ' with disadvantage:'
        this.navigation = '<br>'
        // disadvantage take lowest roll
        roll = Math.min(...[this.d20(), this.d20()]) + mod
      } else {
        this.navRoll = ':'
        this.navigation = ''
        roll = this.d20() + mod
      }

      if (roll >= dc) {
        this.navigation += 'Proceed in intended direction.<br>' + this.hexWord(speed[0]) + ' by foot, ' + this.hexWord(speed[1]) + ' by canoe.' + paceString
      } else {
        var dirs = ['N', 'NE', 'SE', 'S', 'SW', 'NW']
        this.navigation += 'Lost! Proceed ' + dirs[this.d6() - 1] + '<br>' + this.hexWord(speed[0]) + ' by foot, ' + this.hexWord(speed[1]) + ' by canoe.' + paceString
      }
    },
    d100 () {
      return Math.floor(Math.random() * 100) + 1
    },
    d20 () {
      return Math.floor(Math.random() * 20) + 1
    },
    d6 () {
      return Math.floor(Math.random() * 6) + 1
    },
    dRoll (any) {
      return Math.floor(Math.random() * Number(any)) + 1
    },
    fillRange (start, end) {
      return Array(end - start + 1).fill().map((item, index) => start + index)
    },
    hexWord (number) {
      if (number === 1) {
        return number + ' hex'
      } else {
        return number + ' hexes'
      }
    },
    addMonsterLinks (text) {
      var regex = /\{@creature(.*?)\}/g
      var matches = []
      if (text.includes('@creature')) {
        matches = text.match(regex)
      }
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i]
        var link = match.replace('{@creature ', '').replace('}', '')
        var label = ''
        link = link.toLowerCase()
        link = link.split('|')
        if (link.length === 3) {
          label = link[2]
        } else {
          label = link[0]
        }
        link = 'https://5etools.com/bestiary.html#' + link[0].replace(/ /g, '%20') + '_' + link[1]
        // console.log(label + ' ' + link)

        text = text.replace(match, '<a style="color: #8c67ef" href="' + link + '" target="_blank">' + label.replace(/\b\w/g, l => l.toUpperCase()) + '</a>')
      }
      return text
    },
    addCreatureDice (text) {
      var diceNotation = /(\d+)(d)(\d+)(([-+*/])(\d+))?/g
      var matches = text.match(diceNotation)
      if (matches !== null) {
        for (var i = 0; i < matches.length; i++) {
          var match = matches[i].replace(/ /g, '') // remove whitespace
          var dice = match.split('d')
          var howMany = Number(dice[0])
          var diceType = 0
          var plus = 0

          if (dice[1].includes('+')) {
            var addition = dice[1].split('+')
            diceType = Number(addition[0])
            plus = Number(addition[1])
          } else {
            diceType = Number(dice[1])
          }
          var result = 0
          for (var j = 0; j < howMany; j++) {
            result += this.dRoll(diceType)
          }
          result += plus

          text = text.replace(match, '<b>' + result + '</b>')
        }
      }
      return text
    },
    diceList (table) {
      if (this.autoRollTable) { // auto roll table
        var tableRoll = this.dRoll(table.tableSize)

        for (var key in table) {
          var keyString = String(key)
          var keyArray = []
          if (keyString.includes('-')) {
            var keyRange = keyString.split('-')
            keyArray = this.fillRange(Number(keyRange[0]), Number(keyRange[1]))
          } else {
            keyArray = [Number(keyString)]
          }
          // check if roll matches
          if (keyArray.includes(tableRoll)) {
            var result = '<br><br><b>' + table[key] + '</b>'
            return result
          }
        }
      } else { // list entire table
        var list = '<br><br><table style="width:100%">'
        var keys = Object.keys(table)
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] !== 'tableSize') {
            list += '<tr>'
            list += '<td style="padding-left: 4px; padding-right: 4px; width: 52px;">' + keys[i] + '</td>'
            list += '<td style="padding-left: 4px; padding-right: 4px;">' + table[keys[i]] + '</td>'
            list += '</tr>'
          }
        }
        list += '</table>'
        return list
      }
    }
  }
}
</script>

<style scoped>
  .grid-main {
    grid-area: main;
    margin: 16px 0;
  }
  .grid-container {
    display: grid;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    grid-template-columns: auto 300px auto;
    grid-template-rows: auto;
    grid-template-areas:
      ". main .";
  }
  a {
    color: #8c67ef;
  }
</style>
