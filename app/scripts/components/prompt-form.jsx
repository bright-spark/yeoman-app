'use strict';

var React = require('react');

var PromptFormActions = require('../actions/prompt-form-actions');
var CheckboxPrompt = require('./prompts/checkbox.jsx');
var ConfirmPrompt = require('./prompts/confirm.jsx');
var FolderPrompt = require('./prompts/folder.jsx');
var InputPrompt = require('./prompts/input.jsx');
var ListPrompt = require('./prompts/list.jsx');


var PromptForm = React.createClass({

  propTypes: {
    generatorName: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    questions: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getInitialState: function () {
    return {
      visibility: 'show'
    };
  },

  getDefaultProps: function () {
    return {
      questions: []
    };
  },

  _onSubmit: function (e) {

    var answers = {};
    var refs = this.refs;
    var callback = this.props.type === 'cwd' ?
      PromptFormActions.submitSelectedFolder :
      PromptFormActions.submitForm;

    this.props.questions.forEach(function mapAnswers(question) {
      answers[question.name] = refs[question.name].state.answer;
    });

    callback(
      this.props.generatorName,
      answers
    );
    e.preventDefault();
  },

  render: function () {

    var questions = this.props.questions;

    if (questions.length === 0) {
      return null;
    }

    // Factory to create new prompts
    function createPrompt(question) {

      var input = function () {
        return <InputPrompt
          key={question.name}
          ref={question.name}
          name={question.name}
          type={question.type}
          message={question.message}
          defaultAnswer={question.default}
        />;
      };

      var list = function () {
        return <ListPrompt
          key={question.name}
          ref={question.name}
          name={question.name}
          choices={question.choices}
          message={question.message}
          defaultAnswer={question.default}
        />;
      };

      var promptsByType = {
        input: input,
        password: input,
        confirm: function createConfirm() {
          return <ConfirmPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
          />;
        },
        folder: function createFolder() {
          return <FolderPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            message={question.message}
            defaultAnswer={question.default}
          />;
        },
        list: list,
        rawlist: list,
        expand: list,
        checkbox: function createCheckbox() {
          return <CheckboxPrompt
            key={question.name}
            ref={question.name}
            name={question.name}
            choices={question.choices}
            message={question.message}
            defaultAnswer={question.default}
          />;
        }
      };

      return promptsByType[question.type]();
    }

    // Builds required prompts from active questions
    var prompts = questions.map(createPrompt);

    return (
      <form className={this.state.visibility} onSubmit={this._onSubmit}>
        <div>{prompts}</div>
        <div className="action-bar">
          <input className="button" type="reset" value="Reset" />
          <input className="button submit" type="submit" value="Next" />
        </div>
      </form>
    );
  }

});


module.exports = PromptForm;

