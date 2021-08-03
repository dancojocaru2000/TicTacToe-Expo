import React from 'react';

import { Appbar } from 'react-native-paper';

const TopBar = function (props: TopBarProps): React.ReactElement {
  const { style, title, showBack, onBackTap } = props;

  const backButton = !showBack ? undefined : (
    <Appbar.BackAction onPress={onBackTap} />
  );

  return (
    <Appbar.Header style={style}>
      {backButton}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};
export default TopBar;

type TopBarProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style: any;
  title: string;
  showBack: boolean;
  onBackTap: () => void;
};
