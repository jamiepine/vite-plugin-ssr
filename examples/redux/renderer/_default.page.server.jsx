import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { getStore } from "./store";
import { escapeInjections, dangerouslySkipEscape } from "vite-plugin-ssr";

export { render };
export { addPageContext };
export { passToClient };

const passToClient = ["PRELOADED_STATE"];

async function render(pageContext) {
  const { pageHtml } = pageContext;
  return escapeInjections`<!DOCTYPE html>
    <html>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}

async function addPageContext(pageContext) {
  const store = getStore();

  const { Page } = pageContext;
  const pageHtml = renderToString(
    <Provider store={store}>
      <Page />
    </Provider>
  );

  // Grab the initial state from our Redux store
  const PRELOADED_STATE = store.getState();

  return {
    PRELOADED_STATE,
    pageHtml,
  };
}