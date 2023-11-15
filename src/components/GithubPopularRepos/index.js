import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isProgress: 'ISPROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    statusValue: apiStatus.initial,
    activeId: languageFiltersData[0].id,
    list: [],
  }

  componentDidMount() {
    this.makeApiCall()
  }

  makeApiCall = async () => {
    const {activeId} = this.state
    this.setState({statusValue: apiStatus.isProgress})
    const url = `https://apis.ccbp.in/popular-repos?language=${activeId}`

    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const newdata = data.popular_repos.map(item => ({
        name: item.name,
        id: item.id,
        issuesCount: item.issues_count,
        forksCount: item.forks_count,
        starsCount: item.stars_count,
        avatarUrl: item.avatar_url,
      }))
      this.setState({list: newdata, statusValue: apiStatus.success})
    } else {
      this.setState({statusValue: apiStatus.failure})
    }
  }

  isProgress = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  isFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something Went Wrong</h1>
    </div>
  )

  isSuccess = () => {
    const {list} = this.state
    return (
      <ul>
        {list.map(item => (
          <RepositoryItem key={item.id} details={item} />
        ))}
      </ul>
    )
  }

  resultDisplay = () => {
    const {statusValue} = this.state

    switch (statusValue) {
      case apiStatus.isProgress:
        return this.isLoading()
      case apiStatus.success:
        return this.isSuccess()
      case apiStatus.failure:
        return this.isFailure()
      default:
        return null
    }
  }

  setActiveId = id => {
    this.setState({activeId: id}, this.makeApiCall)
  }

  languageList = () => {
    return (
      <ul>
        {languageFiltersData.map(item => (
          <LanguageFilterItem
            key={item.id}
            details={item}
            setActiveId={this.setActiveId}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div>
        <h1>Popular</h1>
        {this.languageList()}
        {this.resultDisplay()}
      </div>
    )
  }
}

export default GithubPopularRepos
