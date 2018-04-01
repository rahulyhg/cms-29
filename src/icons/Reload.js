import React, { PureComponent } from "react";
import classNames from "classnames";

// Open Iconic
// https://github.com/iconic/open-iconic

export default class ReloadIcon extends PureComponent {
  render() {
    return (
      <svg
        viewBox="0 0 8 8"
        {...this.props}
        className={classNames("icon", this.props.className)}
      >
        <path
          d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4c1.1 0 2.12-.43 2.84-1.16l-.72-.72c-.54.54-1.29.88-2.13.88-1.66 0-3-1.34-3-3s1.34-3 3-3c.83 0 1.55.36 2.09.91l-1.09 1.09h3v-3l-1.19 1.19c-.72-.72-1.71-1.19-2.81-1.19z"
        />
      </svg>
    );
  }
}
