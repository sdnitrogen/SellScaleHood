import React from "react"

const HeaderContainer = ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderContainerProps) => {
  return (
    <div className="header-container">
      <h1 className="header-container-title">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient">&nbsp;{user}</span>
        )}
      </h1>
      <p className="header-container-subtext">{subtext}</p>
    </div>
  )
}

export default HeaderContainer
