<div align=center>
  
  ![Preview](.github/assets/preview.png)
  
  ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/mxgic1337/faceit-stats-widget/build-deploy-experimental.yml?style=flat-square&logo=github&logoColor=%23fff) [![Latest release version](https://img.shields.io/github/v/release/mxgic1337/faceit-stats-widget?display_name=tag&style=flat-square&label=version&logo=github&logoColor=%23fff)](https://widget.mxgic1337.xyz) [![package.json version](https://img.shields.io/github/package-json/v/mxgic1337/faceit-stats-widget?style=flat-square&label=experimental&logo=nodedotjs&logoColor=%23fff)](https://widget-git.mxgic1337.xyz)

  <h1>FACEIT Stats Widget</h1>

  A widget for streamers that displays player statistics from **[FACEIT](https://faceit.com)**.

### [🔗 Generator](https://widget.mxgic1337.xyz/)
##### [🧪 Generator (experimental version)](https://widget-git.mxgic1337.xyz/)
</div>

## 🔧 Getting started

To get started, generate your widget link at [this website](https://widget.mxgic1337.xyz/).

Then, add a new browser source in OBS Studio and paste your generated link.

## 🔨 Building

#### Requirements:
- Node.js 18.x or newer
- [pnpm](https://pnpm.io/) package manager

---

#### Building:
- Clone this repository
- Run `pnpm install` to install required dependencies
- Generate a **client side** API key on the [FACEIT for Developers](https://developers.faceit.com/apps) portal
- Create a file named `.env` in the root of the project
- Inside the `.env` file, set the **VITE_FACEIT_API_KEY** variable to your **client side** API key from FACEIT
  ```bash
  VITE_FACEIT_API_KEY="YOUR_API_KEY"
  ```
- Run `pnpm run build` to build the application or `pnpm run dev` to run a dev server

> [!NOTE]
> This project is not affiliated with [FACEIT](https://faceit.com).

