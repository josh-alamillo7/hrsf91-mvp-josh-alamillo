import React from 'react';
import reactDOM from 'react-dom';
import UsernameText from './components/usernametext.jsx';
import LevelClicks from './components/levelclicks.jsx';
import SongList from './components/songlist.jsx';
import ScoreInfo from './components/scoreinfo.jsx';
import SongFilter from './components/songfilter.jsx';
import axiosHelpers from './lib/axiosHelpers.js';
import sorts from './lib/sorts.js';
import SongSort from './components/songsort.jsx';
import PageNavigationClicks from './components/pagenavigationclicks.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      songs: [],
      displaySongs: [],
      scoreInfo: null,
      percentile: null,
      level: null,
      difficulty: null,
      title: null,
    }
    this.handleSubmitUsernameClick = this.handleSubmitUsernameClick.bind(this)
    this.handleLevelChangeClick = this.handleLevelChangeClick.bind(this)
    this.handleSongNameClick = this.handleSongNameClick.bind(this)
    this.handleSubmitScoreClick = this.handleSubmitScoreClick.bind(this)
    this.setPercentilebyScore = this.setPercentilebyScore.bind(this)
    this.filterSongs = this.filterSongs.bind(this)
    this.sortSongs = this.sortSongs.bind(this)
    this.handleForwardClick = this.handleForwardClick.bind(this)
    this.handleBackwardsClick = this.handleBackwardsClick.bind(this)
  }

  filterSongs(value) {
    let filteredSongs = this.state.songs.filter(song => {
      let lowerCaseSong = song[0].toLowerCase()
      return lowerCaseSong.includes(value.toLowerCase())
    })
    this.setState({displaySongs: filteredSongs})
  }

  handleForwardClick() {
    const firstIndexDisplayed = this.state.songs.indexOf(this.state.displaySongs[0])
    this.setState({displaySongs: this.state.songs.slice(firstIndexDisplayed + 20, firstIndexDisplayed + 40)})
  }

  handleBackwardsClick() {
    const firstIndexDisplayed = this.state.songs.indexOf(this.state.displaySongs[0])
    this.setState({displaySongs: this.state.songs.slice(firstIndexDisplayed - 20, firstIndexDisplayed)})
  }

  handleSubmitUsernameClick(value) {
    this.setState({username: value})
  }

  handleLevelChangeClick(level) {
    const app = this;
    axiosHelpers.fetchByLevel(level, (data) => {
      app.setState({displaySongs: data.slice(0, 20), songs: data, level: level, scoreInfo: null, percentile: null})
    })
  }

  handleSongNameClick(song, level) {
    const app = this;
    axiosHelpers.fetchScoreInfo(song, level, (data) => {
      app.setState({scoreInfo: data, difficulty: level, title: song})
      if (this.state.username !== null) {
        axiosHelpers.getUserScore(app.state.username, song, level, (score) => {
        if (score === null) {
          app.setState({percentile: null})
        } else {
          app.setPercentilebyScore(Number(score))
        }        
       })
      }
  })
  }

  handleSubmitScoreClick(score) {
    this.setPercentilebyScore(score);
    axiosHelpers.putScore(this.state.username, score, this.state.level, this.state.difficulty, this.state.title)
    //calculation: compare this score with scoreInfo(since they both correspond to the same song. Set the state percentile to be that)
    //the problem is that this also needs to happen if a song is clicked. But only if score Info is not null.
  }

  setPercentilebyScore(score) {
    const totalPlayers = this.state.scoreInfo.length;
    let rank = totalPlayers;
    for (let scoreIndex = 0; scoreIndex < totalPlayers; scoreIndex++) {
      if (score > this.state.scoreInfo[scoreIndex]) {
        rank = scoreIndex
        break
      }
    }
    const percentile = Math.floor(((totalPlayers - rank) / totalPlayers) * 100);
    this.setState({percentile: percentile})
  }

  sortSongs(e) {
    console.log(e.target.id)
    const app = this

    switch (e.target.id) {
      case 'ABCSort':
        sorts.ABCSort(this.state.songs)
        app.setState({displaySongs: this.state.songs.slice(0, 20)})
        break;

      case 'PFCSort':
        sorts.PFCSort(this.state.songs).then((sortedArray) => {
          app.setState({songs: sortedArray, displaySongs: sortedArray.slice(0, 20)})
        }).catch((err) => {
          console.log(err)
        })
        break;
    }
    
  }

  render() {
    return(
      <div>
        <h1>Dancer Data Retriever ⬅️ ⬇️ ⬆️ ➡️</h1>
        <UsernameText username={this.state.username} handleSubmitUsernameClick={this.handleSubmitUsernameClick} />
        <h2>Choose a level:</h2>
        <LevelClicks handleLevelChangeClick={this.handleLevelChangeClick} />
        <div className = "filterSortContainer">
          <span>Filter by name: </span>
          <SongFilter filterSongs={this.filterSongs} />
          <span> or sort by: </span>
          <SongSort sortSongs={this.sortSongs} />
        </div>
        <div className = "infoContainer">
          <div>You are viewing the information for songtitle</div>
          <SongList songs={this.state.displaySongs} handleSongNameClick={this.handleSongNameClick}/>
          <PageNavigationClicks handleBackwardsClick={this.handleBackwardsClick} handleForwardClick={this.handleForwardClick} songs={this.state.songs} displaySongs={this.state.displaySongs}/>
          
        </div>
        <div className = "titleAndscoreInfoContainer">
          
          <ScoreInfo scores={this.state.scoreInfo} handleSubmitScoreClick={this.handleSubmitScoreClick} percentile={this.state.percentile}/>
        </div>
      </div>
    )
  }
}

reactDOM.render(<App />, document.getElementById('app'))