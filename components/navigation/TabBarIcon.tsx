// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styled } from 'nativewind';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

const StyledIonicons = styled(Ionicons);

type IconName =
    | 'home'
    | 'home-outline'
    | 'mic'
    | 'mic-outline'
    | 'search'
    | 'search-outline'
    | 'star'
    | 'star-outline'
    | 'bookmark'
    | 'bookmark-outline';

interface TabBarIconProps extends IconProps<ComponentProps<typeof Ionicons>['name']> {
  name: IconName;
  className?: string;
}

export function TabBarIcon({ name, className, ...rest }: TabBarIconProps) {
  return <StyledIonicons name={name} size={28} className={className} {...rest} />;
}
