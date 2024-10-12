import { Typography, Layout } from 'antd'
import React from 'react'

interface HeaderProps {
  title: string;
  subtitle: string;
  extra?: React.ReactNode[]
}

export function Header(props: HeaderProps) {
  const { title, subtitle, extra } = props

  return (
    <div style={{ marginLeft: '1em' }}>
      <Typography.Title level={3} style={{ fontWeight: 'bold', marginBottom: '0' }}>{title}</Typography.Title>
      <div style={{display: 'flex', flexDirection: 'row', gap: '0.75em', marginRight: '1.5em', marginBottom: '1em'}}>
        <Typography.Text style={{ fontStyle: 'italic', color: 'grey', marginTop: '0', flex: '1'}} >{subtitle}</Typography.Text>
          {extra && (extra?.map(value => value))}
      </div>
    </div>
  )
}