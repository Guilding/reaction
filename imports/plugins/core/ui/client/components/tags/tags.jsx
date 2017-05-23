import React, { Component, PropTypes } from "react";
import { PropTypes as ReactionPropTypes } from "/lib/api";
import { TagItem } from "./";
import classnames from "classnames";
import { EditButton } from "/imports/plugins/core/ui/client/components";
import TagTree from "/imports/plugins/core/ui-tagnav/client/components/tagTree";
import { TagHelpers } from "/imports/plugins/core/ui-tagnav/client/helpers";
import { getTagIds } from "/lib/selectors/tags";

class Tags extends Component {
  displayName = "Tag List (Tags)";

  handleNewTagSave = (event, tag) => {
    event.preventDefault();
    if (this.props.onNewTagSave) {
      this.props.onNewTagSave(tag, this.props.parentTag);
    }
  };

  handleNewTagUpdate = (event, tag) => {
    if (this.props.onNewTagUpdate) {
      this.props.onNewTagUpdate(tag, this.props.parentTag);
    }
  }

  handleTagSave = (event, tag) => {
    if (this.props.onTagSave) {
      this.props.onTagSave(tag, this.props.parentTag);
    }
  };

  handleTagRemove = (tag) => {
    if (this.props.onTagRemove) {
      this.props.onTagRemove(tag, this.props.parentTag);
    }
  };

  /**
   * Handle tag mouse out events and pass them up the component chain
   * @param  {Event} event Event object
   * @param  {Tag} tag Reaction.Schemas.Tag - a tag object
   * @return {void} no return value
   */
  handleTagMouseOut = (event, tag) => {
    if (this.props.onTagMouseOut) {
      this.props.onTagMouseOut(event, tag, this.props.parentTag);
    }
  };

  /**
   * Handle tag mouse over events and pass them up the component chain
   * @param  {Event} event Event object
   * @param  {Tag} tag Reaction.Schemas.Tag - a tag object
   * @return {void} no return value
   */
  handleTagMouseOver = (event, tag) => {
    if (this.props.onTagMouseOver) {
      this.props.onTagMouseOver(event, tag, this.props.parentTag);
    }
  };

  hasSubTags = (tagId, tags) => {
    if (this.props.hasSubTags) {
      return this.props.hasSubTags(tagId, tags);
    }
  }

  handleTagUpdate = (event, tag) => {
    if (this.props.onTagUpdate) {
      this.props.onTagUpdate(tag, this.props.parentTag);
    }
  };

  hasDropdownClassName = (tag) => {
    if (this.props.hasDropdownClassName) {
      return this.props.hasDropdownClassName(tag);
    }
  }

  navbarSelectedClassName = (tag) => {
    if (this.props.navbarSelectedClassName) {
      return this.props.navbarSelectedClassName(tag);
    }
  }

  tagTreeProps = (tag) => {
    const subTagGroups = _.compact(TagHelpers.subTags(tag));
    const tagsByKey = {};

    if (Array.isArray(subTagGroups)) {
      for (const tagItem of subTagGroups) {
        tagsByKey[tagItem._id] = tagItem;
      }
    }

    return {
      parentTag: tag,
      tagsByKey: tagsByKey || {},
      tagIds: getTagIds({ tags: subTagGroups }) || [],
      subTagGroups
    };
  }

  renderTags() {
    let baseTagNavClass = "";
    if (this.props.isTagNav) {
      baseTagNavClass = "navbar-item";
    }
    if (_.isArray(this.props.tags)) {
      const tags = this.props.tags.map((tag, index) => {
        const classAttr = `${baseTagNavClass} ${this.navbarSelectedClassName(tag)} ${this.hasDropdownClassName(tag)}`;

        return (
          <div className={classAttr} key={index}>
            <TagItem
              {...this.props.tagProps}
              {...this.props}
              data-id={tag._id}
              index={index}
              key={index}
              tag={tag}
              onMove={this.props.onMoveTag}
              onTagInputBlur={this.handleTagSave}
              onTagMouseOut={this.handleTagMouseOut}
              onTagMouseOver={this.handleTagMouseOver}
              onTagRemove={this.handleTagRemove}
              onTagSave={this.handleTagSave}
              onTagUpdate={this.handleTagUpdate}
            />
            {this.props.isTagNav &&
              <div className="dropdown-container">
                <TagTree
                  {...this.props}
                  editable={this.props.editable === true}
                  tagTreeProps={this.tagTreeProps(tag)}
                  onMove={this.props.onMoveTag}
                  onTagInputBlur={this.handleTagSave}
                  onTagMouseOut={this.handleTagMouseOut}
                  onTagMouseOver={this.handleTagMouseOver}
                  onTagSave={this.handleTagSave}
                />
              </div>
            }
          </div>
        );
      });

      // Render an blank tag for creating new tags
      if (this.props.editable && this.props.enableNewTagForm) {
        tags.push(
          <div className={baseTagNavClass} key="newTagForm">
            <TagItem
              {...this.props}
              {...this.props.tagProps}
              blank={true}
              key="newTagForm"
              tag={this.props.newTag}
              inputPlaceholder="Add Tag"
              i18nKeyInputPlaceholder="tags.addTag"
              onTagInputBlur={this.handleNewTagSave}
              onTagSave={this.handleNewTagSave}
              onTagUpdate={this.handleNewTagUpdate}
            />
          </div>
        );
      }

      return tags;
    }

    return null;
  }

  renderEditButton() {
    if (this.props.isTagNav && this.props.canEdit) {
      return (
        <span className="navbar-item edit-button" style={this.props.navButtonStyles.editContainerItem}>
          <EditButton
            onClick={this.props.onEditButtonClick}
            bezelStyle="solid"
            primary={true}
            icon="fa fa-pencil"
            onIcon="fa fa-check"
            toggle={true}
            toggleOn={this.props.editable}
          />
        </span>
      );
    }

    return null;
  }

  render() {
    if (this.props.isTagNav) {
      return (
        <div className="navbar-items">
          {this.renderTags()}
          {this.renderEditButton()}
        </div>
      );
    }

    const classes = classnames({
      rui: true,
      tags: true,
      edit: this.props.editable
    });

    return (
      <div
        className={classes}
        data-id={this.props.parentTag._id}
        ref="tags"
      >
        {this.renderTags()}
      </div>
    );
  }
}

// Default Props
Tags.defaultProps = {
  parentTag: {}
};

// Prop Types
Tags.propTypes = {
  canEdit: PropTypes.bool,
  editable: PropTypes.bool,
  enableNewTagForm: PropTypes.bool,
  hasDropdownClassName: PropTypes.func,
  hasSubTags: PropTypes.func,
  isTagNav: PropTypes.bool,
  navButtonStyles: PropTypes.object,
  navbarSelectedClassName: PropTypes.func,
  newTag: PropTypes.object,
  onClearSuggestions: PropTypes.func,
  onEditButtonClick: PropTypes.func,
  onGetSuggestions: PropTypes.func,
  onMoveTag: PropTypes.func,
  onNewTagSave: PropTypes.func,
  onNewTagUpdate: PropTypes.func,
  onTagMouseOut: PropTypes.func,
  onTagMouseOver: PropTypes.func,
  onTagRemove: PropTypes.func,
  onTagSave: PropTypes.func,
  onTagSort: PropTypes.func,
  onTagUpdate: PropTypes.func,
  parentTag: ReactionPropTypes.Tag,
  showBookmark: PropTypes.bool,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  tagProps: PropTypes.object,
  tags: ReactionPropTypes.arrayOfTags
};

// Export
export default Tags;
