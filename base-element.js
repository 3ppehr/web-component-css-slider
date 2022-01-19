/**
 * Custom Elements
 *
 * @copyright  IBM.Co.ir    2021
 * @author    S.A.Hashemi    <hashemi@ibm.co.ir>
 * @version    1.0.0      2021.01.01
 *
 * @require    Chrome 72+ | Firefox 69+
 */

import config from "./config.js";

//import * as library from './library.js'

/**
 * baseElement
 * @class
 * @public
 */

export class baseElement extends HTMLElement {
  index = 0;
  data = null;
  rendersLoopJoin = "\r\n";
  render = () => ``;

  renderMain = () => `

   <link rel="stylesheet" href="./components/base-styles.css">
   
   
 ${this.hasAttribute("externalStyle")
      ? `<link rel='stylesheet' href="${this.externalStyle}">`
      : ""
    }  
 
 
 
   <main>
   </main>
 `;

  _main = null;

  url = "";
  crossOrigin = "Anonymous";
  target = "_self";

  requestOptions = {
    method: "GET",
    cache: "no-cache",
    mode: this.crossOrigin == "Anonymous" ? "cors" : "same-origin", // no-cors, *cors, same-origin
    credentials: "same-origin", // include, *same-origin, omit
    referrer: "client",
    headers: {
      accept: "*/*",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json; charset=utf-8", // or 'application/x-www-form-urlencoded'
    },
    //redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: null,
  };

  schemaBase = {
    size: {
      value: "md",
      values: {
        xxl: "xxl",
        xl: "xl",
        lg: "lg",
        md: "md",
        sm: "sm",
        xs: "xs",
      },
    },
    height: {
      value: "auto",
    },
    width: {
      value: "auto",
    },
    class: {
      value: "",
    },
    timeZone: {
      value: localStorage.getItem("timeZone") ?? "Asia/Tehran",
    },
    externalStyle: {
      value: "",
    },
    dataKey: {
      value: ""
    }
  };

  schema = {};

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }
  beforeRender() { }
  switchFunction() { }
  afterRender() { }

  connectedCallback() {
    this.schema = { ...this.schemaBase, ...this.schema };
    // console.log(this.schema)
    //console.log("before",this, this.schema, this.timeZone)

    //this.dir = document.dir || 'ltr'
    //console.log(this, this.schema, this.timeZone)

    for (let item in this.schema) {
      let val = this.getAttribute(item);

      /*     if(item === "params"){
             debugger
           }*/

      if (
        this.schema?.[item].value &&
        typeof this.schema[item].value === "object" &&
        val
      ) {
        try {
          this[item] = JSON.parse(val);
        } catch (ex) {
          console.warn("JSON is not valid:", val);
          //debugger;
          this[item] = val ?? this.schema?.[item].value ?? {};
        }
      } else {
        this[item] =
          ((val &&
            (this.schema?.[item]?.values
              ? this.schema?.[item].values?.[val] ?? this.schema[item].value
              : val)) ||
            this.schema[item].value) ??
          "";
      }
    }

    this.shadowRoot.innerHTML = this.renderMain();
    this._main = this.shadowRoot.querySelector("main");

    this.update();

    if (this.url) {
      let _this = this;
      function observer(changes) {
        setTimeout(() => {
          changes.forEach((change) => {
            if (
              change.intersectionRatio > 0 &&
              !_this.classList.contains("fetched")
            ) {
              _this.classList.add("fetched");
              _this.fetch();
            }
          });
        }, 200);
      }
      let elObserver = new IntersectionObserver(observer);
      elObserver.observe(this);
    } else {
      this.dispatchEvent(
        new CustomEvent("loaded", {
          bubbles: true,
          detail: {
            data: this.data,
            length: this.data?.length,
            index: this.index,
          },
        })
      );
    }

    /*    this._main.addEventListener('click', e => {
      this.onClickCallback(e)
 
      this.dispatchEvent(new CustomEvent('click', {
        bubbles: true,
        detail: {
          element: e.target,
          data: this.data,
          length: this.data?.length,
          index: this.index,
        },
      }))
 
    })*/

    /*return new Promise((resolve, reject) => {
      import('../js/bootstrap5/popper.min.js').then(() => {
        import('../js/bootstrap5/bootstrap.min.js').then(() => {
          resolve();
        })
      })
    });*/
  }

  disconnectedCallback() {
    if (this.interval) clearInterval(this.interval);

    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  adoptedCallback() {
    //
  }

  onClickCallback = (e) => { };

  update() {
    // if(this.data.length > 0){
    //console.log(this.data)
    this.updateCallback();
    this.beforeRender();

    let html;
    try {
      html = this.render();
    } catch (ex) {
      console.error(ex);
      html = "";
    }
    this._main.innerHTML = html;

    this.afterRender();

    this.importNotDefinedComponents();

    //for(const i in this.data){
    //}
    //}
  }

  updateCallback(attrName, oldVal, newVal) { }

  fetch() {
    if (this.url.trim() !== "") {
      //console.log(this.url)
      document.body.classList.add("loading");
      //document.body.style.cursor = 'wait'
      this._main.classList.add("loading");
      // this._main.classList.contains('loading') ? this._main.style.display="none" :''
      /*this._main.classList.add('spinner-border')
      this._main.setAttribute('role','status')*/
      this._main.style.cursor = "wait";

      fetch(this.url, this.requestOptions)
        .then((res) => {
          //console.log(res)
          if (res.status != 200) {
            document.body.classList.remove("loading");
            //document.body.style.cursor = 'auto'
            this._main.classList.remove("loading");
            /*this._main.classList.remove('spinner-border')
            this._main.setAttribute('role','')*/
            this._main.style.cursor = "auto";
          } else {
            //console.log(res)
            res
              .json()
              .then((data) => {
                if (data) {
                  this.data = this.dataKey ? this.dataKey.split(".").reduce((prev, cur) => {
                    return typeof prev == "object" ? prev[cur] : data[prev][cur]
                  }) : data;

                  this.dispatchEvent(
                    new CustomEvent("loaded", {
                      bubbles: true,
                      detail: {
                        data: this.data,
                        length: this.data.length,
                        index: this.index,
                      },
                    })
                  );
                  
                  this.update();
                }


                document.body.classList.remove("loading");
                //document.body.style.cursor = 'auto'
                this._main.classList.remove("loading");
                /* this._main.classList.remove('spinner-border')
               this._main.setAttribute('role','')*/
                this._main.style.cursor = "auto";
              })
              .catch((error) => {
                this.dispatchEvent(new CustomEvent("error", error));
                document.body.classList.remove("loading");
                //document.body.style.cursor = 'auto'
                this._main.style.cursor = "auto";
                this._main.classList.remove("loading");
                /*this._main.classList.remove('spinner-border')
              this._main.setAttribute('role','')*/
              });
          }
        })
        .catch((error) => {
          //console.error('Error: ', error)
        });
    }
  }

  importNotDefinedComponents() {
    this.shadowRoot
      .querySelectorAll(":not(:defined)")
      .forEach((el) => import(`./${el.localName}/${el.localName}.js`));
  }

  static get observedAttributes() {
    return ["url", "width", "height", "size", "model"];
  }

  attributeChanged(attrName, oldVal, newVal) {
    //if(attrName === '...')
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal === newVal) return;

    if (this.schema?.[attrName]?.values) {
      this[attrName] =
        this.schema[attrName].values[newVal] ??
        this.schema[attrName].values[this.schema[attrName].value] ??
        "";
    } else {
      switch (attrName) {
        case "url":
          this.url = newVal;
          /*if(!oldVal)
            this.fetch();*/
          break;
        case "width":
          this.style.width = newVal;
          break;
        case "height":
          this.style.height = newVal;
          break;
        default:
          if (newVal.startsWith("{") || newVal.startsWith("[")) {
            try {
              this[attrName] = JSON.parse(newVal);
            } catch (ex) {
              console.error(ex);
              this[attrName] = newVal;
            }
          } else this[attrName] = newVal;
      }
    }
    this.attributeChanged(attrName, oldVal, newVal);
    // this.update()
  }

  get count() {
    return parseInt(
      getComputedStyle(this.shadowRoot.host).getPropertyValue("--count")
    );
  }

  set count(val) {
    this.shadowRoot.host.style.setProperty("--count", val);
  }

  /**
   * Escape HTML
   * Tag functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
   * @function
   * @param {string} : ''
   * @param {} : ''
   * @returns {string} : ''
   * @example
   * render = () => this.escapeHTML`<a></a>`
   */
  escapeHTML = (template, ...expressions) =>
    template.reduce(
      (accumulator, part, i) => `${accumulator}${expressions[i - 1]}${part}`
    );
}
