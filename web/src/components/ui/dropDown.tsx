import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography } from 'antd';

interface dropdownItemsInterface {
  key: string;
  label: string;
}

interface DropDownProps {
  models: string[]
  model: string
  setModel: (model: string) => void
}

export function DropDown(props: DropDownProps): React.ReactElement {
  const { models, model, setModel } = props
  const [dropdownItems, setDropdownItems] = useState<dropdownItemsInterface[]>([])

  useEffect(() => {
    const items = models.map((val, i): dropdownItemsInterface => { return { key: i.toString(), label: val } })
    setDropdownItems(items)
  }, [models])

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setModel(dropdownItems.find(val => val.key === key)!.label)
  };

  return <>
    <Space wrap>
      <Dropdown.Button
        menu={{
          items: dropdownItems,
          selectable: true,
          defaultSelectedKeys: ['0'],
          onClick: onClick
        }}
      >
        {model}
      </Dropdown.Button>
    </Space>
  </>
}