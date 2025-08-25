import { BrowserRouter } from 'react-router-dom';
import { Widget } from './widget/Widget';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Widget preview={false} />
  </BrowserRouter>
);
