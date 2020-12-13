import { Component } from '../lib/preact.js';
import { html } from '../Helpers.js';
import { route } from '../lib/preact-router.es.js';
import {publicState} from '../Main.js';

class ExplorerView extends Component {
  render() {
    return html`
      <div class="main-view public-messages-view">
        <div class="centered-container">
          <${ExplorerNode} path=''/>
        </div>
      </div>
    `;
  }
}

class ExplorerNode extends Component {
  constructor() {
    super();
    this.eventListeners = {};
    this.state = {children: {}};
    this.children = {};
  }

  getNode() {
    if (this.props.path) {
      const path = this.props.path.split('/');
      return path.reduce((sum, current) => sum.get(current), publicState);
    }
    return publicState.user(this.props.user);
  }

  componentWillUnmount() {
    Object.values(this.eventListeners).forEach(e => e.off());
    this.eventListeners = {};
  }

  componentDidMount() {
    this.getNode().map().on((v, k) => {
      this.children[k] = v;
      this.setState({children: this.children});
    });
  }

  render() {
    return html`
      <ul>
        ${Object.keys(this.state.children).map(k => {
          const v = this.state.children[k];
          let s = v;
          if (v && typeof v === 'object') {
            console.log(v);
            const path = v['_']['#'];
            s = html`<${ExplorerNode} path=${path}/>`;
          }
          return html`
            <li>
              <b>${k}</b>: ${s}
            </li>
            `;
        })}
      </ul>
    `;
  }
}

export default ExplorerView;