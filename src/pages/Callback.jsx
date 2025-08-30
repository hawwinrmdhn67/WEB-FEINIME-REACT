import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      localStorage.setItem("mal_auth_code", code);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p className="text-center">Processing login...</p>;
}

export default Callback;
