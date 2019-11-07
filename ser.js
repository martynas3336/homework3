const path = require('path');

class Ser {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.messages = req.flash('messages');
    this.notifications = [];
    this.userInfo = {};
    this._params = {};
    this.action = null;
    this.location = null;
    this.settings = null;
    this._status = 200;
    this._json = {};
  }

  message(type, msg) {
    if(!this.messages.includes({type:type, msg:msg}))
    {
      this.messages.push({type:type, msg:msg})
    }
  }

  params(name, value) {
    this._params[name] = value;
  }

  redirect(location) {
    this.action = "redirect",
    this.location = location;
  }

  render(location) {
    this.action = "render",
    this.location = path.join(__dirname, location);
  }

  end() {
    this.action = "end";
  }

  send(location, settings) {
    this.action = "send",
    this.location = location,
    this.settings = settings
  }

  status(_status) {
    this._status = _status;
  }

  json(_json) {
    this.action = 'json';
    this._json = _json;
  }

  done(status=true) {
    if(!status)
    {
      let isErr = false;
      for(var i = 0; i < this.messages.length; i++)
      {
        if(this.messages[i].type == "error")
        {
          isErr = true;
        }
      }

      if(!isErr)
      {
        this.message("error", "unrecognized error");
      }
    }

    let post_params = {};
    if (this.action == "render") {
      post_params = this.req.flash("post_params");
      if (!post_params.length) {
        post_params = {};
      } else {
        post_params = post_params[0];
      }
    }

    if (post_params) {
      delete post_params.password;
      delete post_params.captcha;
      delete post_params._csrf;
    }

    let resParameters = {
      messages: this.messages,
      notifications: this.notifications,
      userInfo: this.userInfo,
      requestInfo: {
        path: this.req.path,
        pathname: this.req.pathname,
        get_params: this.req.query || {},
        post_params: post_params || {},
      },
      params:this._params,
    }

    if(this.action == "end") {
      this.res.end();
    }

    if(this.action == "send") {
      this.res.status(200).send(this.location, this.settings);
    }

    if(this.action == "redirect") {
      if(this.messages.length)
      {
        this.req.flash("messages", this.messages);
      }
      this.res.redirect(this.location);
    }

    if(this.action == "render") {
      this.res.render(this.location, resParameters);
    }

    if(this.action === 'json') {
      this.res.status(this._status).json(this._json);
    }
  }

}

function mw()
{
  return function (req, res, next) {
    req.ser = new Ser(req, res);
    next();
  };
}

module.exports = {
  mw: mw
}
