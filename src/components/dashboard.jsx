import React, { Component } from "react";
import { Link } from "react-router-dom";
import Pagination from "./common/pagination";
import ListGroup from "./listgroup";
import Posts from "./posts";
import { paginate } from "../utils/paginate";
import { api } from "../config.js";
import http from "../services/httpService";
import Jumotron from "./common/jumbotron";
import LoadingSpinner from './LoadingSpinner'; // Import the LoadingSpinner component

class Dashboard extends Component {
  state = {
    allposts: [],
    currentPage: 1,
    pageSize: 4,
    tags: [],
    selectedTag: { _id: "1", name: "All Posts" },
    loading: true, // Initialize loading state
  };

  async componentDidMount() {
    try {
      const { data: allposts } = await http.get(api.postsEndPoint);
      const { data: tags } = await http.get(api.tagsEndPoint);

      allposts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      this.setState({
        allposts: [...allposts],
        tags: [
          {
            _id: "1",
            name: "All Posts",
          },
          ...tags,
        ],
        loading: false, // Set loading to false when API calls are completed
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ loading: false }); // Set loading to false even if there's an error
    }
  }

  // Other methods remain unchanged

  render() {
    const { user } = this.props;
    const { allposts, pageSize, currentPage, tags, selectedTag, loading } = this.state;
    const filtered = selectedTag._id === "1" ? allposts : this.getPosts();
    const posts = paginate(filtered, currentPage, pageSize);

    // Show loading spinner while data is being fetched
    if (loading)
      return <LoadingSpinner />;

    if (allposts.length === 0)
      return <p>No posts found.</p>;

    return (
      <React.Fragment>
        <Jumotron />
        <div className="container-fluid" >
          <div className="row">
            <div className="col">
              <div className="d-flex w-100 justify-content-between m-3">
                Showing {filtered.length} posts.
                <Link to="/new-post">
                  <button
                    type="button"
                    className="btn btn-success"
                    style={{ marginBottom: 20 , backgroundColor: 'rgb(120, 159, 159)'}}
                  >
                    New Post
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <Posts posts={posts} onDelete={this.handlePostDelete} />
            </div>
            <div className="col-3">
              <ListGroup
                items={tags}
                selectedTag={this.state.selectedTag}
                onTagSelect={this.handleTagSelect}
              />
            </div>
            <Pagination
              itemCount={filtered.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;

