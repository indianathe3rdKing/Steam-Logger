import React from "react";

export type Props = {
  items: Array<{
    key: string;
    title: string;
    icon: string;
    iconAndroid?: string;
  }>;
  onSelect: (key: string) => void;
};

export const DropdownMenu = ({ items, onSelect }: Props) => {
  return <div>dropdown-menu</div>;
};
