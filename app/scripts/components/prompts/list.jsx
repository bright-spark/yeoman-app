'use strict';

var React = require('react');

var PromptMixin = require('./prompt-mixin');


var ListPrompt = React.createClass({

  mixins: [PromptMixin],

  getInitialState: function () {
    return {
      answer: this.props.defaultAnswer
    };
  },

  _onChange: function (event) {
    this.setState({
      answer: event.currentTarget.value
    });
  },

  render: function () {

    var choices = this.props.choices.map(function (choice, index) {

      var def = this.props.defaultAnswer;
      var checked = def === index || def === choice.value;

      return (
        <span className="list">
          <label htmlFor={this.props.name}>{choice.name}</label>
          <input
            type="radio"
            name={this.props.name}
            value={choice.value}
            checked={checked}
            onChange={this._onChange}
          />
        </span>
      );
    });

    return (
      <p>
        <label>{this.props.message}</label>
        {choices}
      </p>
    );
  }

});


module.exports = ListPrompt;

