import ReactDOM from 'react-dom/client';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';

import { ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';

import GlobalStyle from './styles/GlobalStyle';
import defaultTheme from './styles/defaultTheme';

import store from './stores';

import routes from './routes';

function init() {
  const container = document.getElementById('root');

  if (!container) {
    return;
  }

  const router = createBrowserRouter(routes);

  const root = ReactDOM.createRoot(container);

  root.render(
    <ThemeProvider theme={defaultTheme}>
      <Provider store={store}>
        <Reset />
        <GlobalStyle />
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>,
  );
}

init();
