import React from "react"
import AnimatedCounter from "./AnimatedCounter"

const BalanceTag = ({ title, value, net }: BalanceTagProps) => {
  return (
    <div className="flex flex-col">
      <p className="total-balance-label">{title}</p>
      <div
        className={`total-balance-amount flex-center ${
          net && (net === "+" ? "!text-success-700" : "!text-destructive")
        }`}>
        {net}
        <AnimatedCounter amount={value} />
      </div>
    </div>
  )
}

export default BalanceTag
