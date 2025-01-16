import packageJSON from "../../../package.json";

export const Footer = () => {
  return (
    <footer>
      <div>
        <small>
          This project is not affiliated with{" "}
          <a href={"https://faceit.com"} target={"_blank"}>
            FACEIT
          </a>
          .
        </small>
        <small>
          <a
            href={
              "https://github.com/mxgic1337/faceit-stats-widget/blob/master/LICENSE"
            }
            target={"_blank"}
          >
            MIT License
          </a>{" "}
          &bull;{" "}
          <a
            href={"https://github.com/mxgic1337/faceit-stats-widget"}
            target={"_blank"}
          >
            GitHub
          </a>{" "}
          &bull;{" "}
          <a
            href={"https://github.com/mxgic1337/faceit-stats-widget/issues/new"}
            target={"_blank"}
          >
            Report an issue
          </a>
        </small>
      </div>
      <div>
        <small>
          Copyright &copy;{" "}
          <a href={"https://github.com/mxgic1337"} target={"_blank"}>
            mxgic1337_
          </a>{" "}
          2025
        </small>
        <small>v{packageJSON.version}</small>
      </div>
    </footer>
  );
};
