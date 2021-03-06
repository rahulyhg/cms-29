import React, { Component } from "react";
import DocumentTitle from "react-document-title";
import { Route, Redirect, Switch } from "react-router-dom";
import Nav from "./Nav";
import Entries from "./Entries";
import Settings from "./Settings";
import * as settings from "../models/settings";
import ContentTypes from "./ContentTypes";
import { LoadingIcon } from "../icons";

class Layout extends Component {
  render() {
    return (
      <DocumentTitle title="CMS">
        <ContentTypes>
          {contentTypes => (
            <div className="row no-gutters minh-100">
              <div className="col-sm-4 col-md-3 col-xl-2 bg-light">
                <div className="p-4">
                  {contentTypes.loading
                    ? <span className="text-muted"><LoadingIcon /></span>
                    : <Nav contentTypes={contentTypes.value} />}
                </div>
              </div>
              <div className="col">
                <div className="p-4">
                  {contentTypes.ready
                    ? <Switch>
                        <Route path="/settings/:model" component={Settings} />
                        <Route
                          path="/content/:model"
                          render={props => (
                            <Entries
                              {...props}
                              contentTypes={contentTypes.value}
                            />
                          )}
                        />
                        <Redirect
                          to={`/content/${contentTypes.value[0].property}`}
                        />
                      </Switch>
                    : null}
                </div>
              </div>
            </div>
          )}
        </ContentTypes>
      </DocumentTitle>
    );
  }
}

export default Layout;
