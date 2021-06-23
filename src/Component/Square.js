import React, { useEffect, useState } from "react";

export default function Square(props) {
  const { value, onClick, cMenu } = props;

  function getValue() {
    if (!value.isRevealed) {
      return props.value.isFlagged ? "🇮🇳" : null;
    }
    if (value.isMine) {
      return "🔥";
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  }

  let className =
    "square" +
    (value.isRevealed ? "" : " hidden") +
    (value.isMine ? " is-mine" : "") +
    (value.isFlagged ? " is-flag" : "");

  return (
    <div onClick={onClick} className={className} onContextMenu={cMenu}>
      {getValue()}
    </div>
  );
}
