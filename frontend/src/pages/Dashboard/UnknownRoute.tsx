import { useParams } from "react-router-dom";

const DEFAULT_TEXT = "404 - Page not found";
export default function UnknownRoute() {
  const { unknownRoute = DEFAULT_TEXT } = useParams();
  return (
    <div className="flex items-center justify-center w-full h-full">
      <h1 className="text-4xl text-slate-400 capitalize">{unknownRoute}</h1>
    </div>
  );
}
