import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 6,
    category: "general",
  };
  static propsTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
    };
    document.title = `${this.capitalize(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading:false
    });
    this.props.setProgress(100);
  }
  

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({ page: this.state.page + 1 });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
    });
  };

 
  

  // handlePrevClick = async () => {
  //   this.setState({ page: this.state.page - 1 });
  //   this.updateNews();
  // };

  // handleNextClick = async () => {
  //   this.setState({ page: this.state.page + 1 });
  //   this.updateNews();
  // };

  render() {
    return (
      <>
        <div className="my-3">
          <h2 className="text-center my-5">
            NewsMonkey - Top {this.capitalize(this.props.category)} News
          </h2>

          {this.state.loading && <Spinner/>}
          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length !== this.state.totalResults}
            loader={ this.state.articles.length < this.state.totalResults ? (
        <Spinner />
      ) : (
        <p>No more data to load</p>
      )}
          >
            <div className="container">
            <div className="row">
              {this.state.articles.map((e) => {
                return (
                  <div className="col-lg-4 col-md-6 col-sm-12" key={e.url}>
                    <NewsItem
                      title={e.title ? e.title.slice(0, 45) : ""}
                      description={
                        e.description ? e.description.slice(0, 88) : ""
                      }
                      imageUrl={e.urlToImage}
                      newsUrl={e.url}
                      author={e.author}
                      date={e.publishedAt}
                      source={e.source.name}
                    />
                  </div>
                );
              })}
            </div>
            </div>
          </InfiniteScroll>
          

         

          {/* <div className="container d-flex justify-content-center mt-5">
            <button
              disabled={this.state.page <= 1}
              className="btn btn-warning me-md-2 mx-2"
              type="button"
              onClick={this.handlePrevClick}
            >
              &larr; Previous
            </button>
            <button
              className="btn btn-warning mx-2"
              type="button"
              onClick={this.handleNextClick}
              disabled={
                this.state.page + 1 >
                Math.ceil(this.state.totalResults / this.props.pageSize)
              }
            >
              Next &rarr;
            </button>
            {/* </div> */}
        </div>
      </>
    );
  }
}

export default News;
