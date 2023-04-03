import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import withSDK from '~/core/hocs/withSDK';
import useUserFilters from '~/core/hooks/useUserFilters';
import customizableComponent from '~/core/hocs/customization';
import Select from '~/core/components/Select';
import useCategories from '~/social/hooks/useCategories';
import CategoryHeader from '~/social/components/category/Header';

import { Selector, SelectIcon, InputPlaceholder } from './styles';
import userMatchesCommunityCategorySegment from '~/helpers/userMatchesCommunityCategorySegment';

const CategorySelector = ({
  'data-qa-anchor': dataQaAnchor = '',
  value: categoryId,
  onChange,
  parentContainer = null,
  currentUserId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const { localeLanguage, businessType, partnerId } = useUserFilters(currentUserId);

  const [categories] = useCategories({ isDeleted: false });
  const options = categories
    .filter((cat) =>
      userMatchesCommunityCategorySegment(localeLanguage, businessType, partnerId, cat),
    )
    .map((category) => ({
      name: category.name,
      value: category.categoryId,
    }));

  const itemRenderer = ({ value }) => <CategoryHeader categoryId={value} />;

  const triggerRenderer = (props) => {
    return (
      <Selector {...props} data-qa-anchor={`${dataQaAnchor}-category-selector`}>
        {categoryId ? (
          <CategoryHeader categoryId={categoryId} />
        ) : (
          <FormattedMessage id="selectACategory">
            {(placeholder) => <InputPlaceholder>{placeholder}</InputPlaceholder>}
          </FormattedMessage>
        )}
        <SelectIcon />
      </Selector>
    );
  };

  return (
    <Select
      data-qa-anchor={`${dataQaAnchor}-category`}
      options={options}
      renderTrigger={(props) => triggerRenderer({ ...props, onClick: toggle })}
      renderItem={itemRenderer}
      parentContainer={parentContainer}
      isOpen={isOpen}
      handleClose={close}
      onSelect={({ value }) => onChange(value)}
    />
  );
};

CategorySelector.propTypes = {
  'data-qa-anchor': PropTypes.string,
  value: PropTypes.string,
  parentContainer: PropTypes.instanceOf(Element),
  onChange: PropTypes.func,
  currentUserId: PropTypes.string.isRequired,
};

export default withSDK(customizableComponent('CategorySelector', CategorySelector));
