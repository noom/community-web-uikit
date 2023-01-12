import React from 'react';
import Switch from '~/core/components/Switch';
import {
  SwitchItemContainer,
  SwitchItemDescription,
  SwitchItemName,
  SwitchItemPrompt,
} from './styles';
import { useSDK } from '~/core/hooks/useSDK';

const SwitchItem = ({ onChange, value, title, prompt }) => {
  const { connected } = useSDK();
  return (
    <SwitchItemContainer>
      <SwitchItemDescription>
        <SwitchItemName>{title}</SwitchItemName>
        <SwitchItemPrompt>{prompt}</SwitchItemPrompt>
      </SwitchItemDescription>

      <Switch
        disabled={!connected}
        value={value}
        data-qa-anchor="community-permissions"
        onChange={onChange}
      />
    </SwitchItemContainer>
  );
};

export default SwitchItem;
