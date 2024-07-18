import "./App.css";

import Daybook from "./components/Daybook";
import Issues from "./components/Issues";

import { useState } from "react";

export default function App() {
  const [pad, setPad] = useState<string | null>("daybook");

  if (pad == "daybook") {
    return <Daybook pad={pad} setPad={setPad} />;
  }
  if (pad == "issues") {
    return <Issues pad={pad} setPad={setPad} />;
  }
}
