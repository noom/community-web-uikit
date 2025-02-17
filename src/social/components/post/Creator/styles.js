import styled from 'styled-components';
import { PrimaryButton } from '~/core/components/Button';
import InputText from '~/core/components/InputText';
import UIAvatar from '~/core/components/Avatar';
import { Poll } from '~/icons';
import PlayCircle from '~/icons/PlayCircle';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const PostCreatorContainer = styled.div`
  padding: 16px 20px 12px 16px;
  border: 1px solid #edeef2;
  display: flex;
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 8px;
`;

export const Footer = styled.div`
  padding-top: 12px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  & > label {
    @media (max-width: 960px) {
      flex: 1;
      margin-right: 0;
      border-radius: 8px;
    }
  }
`;

export const PostContainer = styled.div`
  flex-grow: 1;
  width: 85.5%;
`;

export const PostButton = styled(PrimaryButton)`
  padding: 10px 16px;
  margin-left: auto;

  @media (max-width: 960px) {
    width: 100%;
    flex-basis: 100%;
  }
`;

export const UploadsContainer = styled.div`
  padding: 1rem 1rem 0;
  display: none;
  ${({ show }) => show && `display: block`}
`;

export const PostInputText = styled(InputText)`
  display: block;
  & > textarea {
    width: 100%;
  }
`;

export const VideoAttachmentIcon = styled(PlayCircle)`
  vertical-align: -0.125em;
`;

export const PollButton = styled.label`
  background: none;
  border: none;
  background: rgb(235 236 239 / 60%);
  transition: background 0.1s;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus,
  &:active {
    background: rgb(235 236 239);
  }
`;

export const PollIcon = styled(Poll)``;
