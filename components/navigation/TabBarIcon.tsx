import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { ComponentProps } from 'react';

const StyledMaterialCommunityIcons = styled(MaterialCommunityIcons);

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TabBarIconProps extends ComponentProps<typeof MaterialCommunityIcons> {
  name: IconName;
  className?: string;
}

export function TabBarIcon({ name, className, ...rest }: TabBarIconProps) {
  return <StyledMaterialCommunityIcons name={name} size={28} className={className} {...rest} />;
}




