import React from 'react'

const Header = () => {

  return (
      <div className="space-y-2 text-center flex flex-col">
        <h1 className="text-2xl font-bold text-transparent bg-primary bg-clip-text">
          Task Manager
        </h1>
        <p className="text-sm text-muted-foreground">
            Manage your tasks efficiently and stay organized
        </p>
     
      </div>
  )
}

export default Header