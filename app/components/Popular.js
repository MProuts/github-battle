var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api');

function SelectLanguage(props) {
  const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python'];

  return(
    <ul className='languages'>
      {languages.map(function(language) {
        return (
          <li
            style={
              language === props.selectedLanguage ?
                { color: '#d0021b' } :
                null
            }
            onClick={props.onSelect.bind(null, language)}
            key={language}>
            {language}
          </li>
        )
      }, this)}
    </ul>
  )
}

function RepoGrid(props) {
  return (
    <ul className='popular-list'>
      {props.repos.map(function(repo, index) {
        return (
          <li key={repo.name} className='popular-item'>
            <div className='popular-rank'>#{index + 1}</div>
            <ul className='space-list-items'>
              <li>
                <img
                  className='avatar'
                  src={repo.owner.avatar_url}
                  alt={'Avatar for ' + repo.owner.login} />
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

SelectLanguage.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

class Popular extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      repos: null,
      selectedLanguage: 'All'
    };
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }

  updateLanguage(selectedLanguage) {
    this.setState(
      {
        selectedLanguage,
        repos: null
      }
    )

    api.fetchPopularRepos(selectedLanguage)
      .then(function(repos) {
        this.setState({ repos });
      }.bind(this));
  }

  render() {
    return (
      <div>
        <SelectLanguage
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {
          !this.state.repos ?
            <p>LOADING</p> :
            <RepoGrid repos={this.state.repos} />
        }
      </div>
    )
  }
}

module.exports = Popular;
