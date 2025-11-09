![Logo of the project](https://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif)

# Game of Life Experiments
> Exploring Conway's Game of Life (GOL) across different languages and environments

This repository contains several experimental implementations of **Conway's Game of Life**, created to explore the algorithm and different programming approaches.  
It includes both frontend (web) and backend (console or script-based) versions, showing how the same logic can be realized in different contexts.

## Installing / Getting started

You can clone the repository and run the web version directly in your browser.

```shell
git clone https://github.com/tizianobarbari/life-gols.git
cd life-gols/docs
```

Then open `index.html` in any modern browser (no build or server required).
The web version uses JavaScript and Canvas for rendering.

For the Python console version:

```shell
cd ..
python gol.py
```

This launches a simple ASCII version of the Game of Life that runs in the terminal.

### Initial Configuration

No special configuration is required for the JS version.  
For the Python version, make sure you have Python 3 installed.

You can also create a virtual environment if desired:

```shell
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

## Developing

If you want to modify or extend the project, you can start by cloning and exploring the folder structure:

```shell
git clone https://github.com/tizianobarbari/life-gols.git
cd life-gols/
```

- `docs/` contains all **frontend code** (HTML, CSS, JS).  
  - `frontend/engines/js-engine.js` is the JavaScript engine implementing the core logic.
  - `main.js` ties UI controls to the engine.
  - `index.html` is the main entry point for the browser app.
- The **backend/console experiments** (like `gol.py`) are outside `docs/`.

### Building

The project does not require a build system at this stage.  
All browser code is plain JavaScript and runs directly from local files.  
Future versions may include a module bundler or WebAssembly integration for performance testing.

### Deploying / Publishing

You can deploy the web version easily using any static hosting platform (e.g. GitHub Pages):

```shell
# From the repo root
git subtree push --prefix docs origin gh-pages
```

Then visit `https://tizianobarbari.github.io/life-gols/`

## Features

* Conway's Game of Life core logic implemented in pure JavaScript and Python
* Interactive browser version with Canvas rendering
* Adjustable speed and rules (B/S format)
* Pattern placement
* Live generation and population count
* Extendable engine structure for experimenting with new rules or implementations

## Configuration

The JavaScript version includes several adjustable settings:

#### `rule`
Type: `String`  
Default: `B3/S23`  
Defines the birth/survival rules in standard Life-like notation.

#### `speed`
Type: `Number`
Controls how many generations are computed per second.

#### `patterns`
Pattern buttons allow inserting predefined configurations:
- Glider
- Small Exploder
- Pulsar
- ...

More patterns can be added by editing the `patterns` object in `main.js`.

Example usage:
```bash
# Click "Glider" → then click on the canvas to place it
# or click again to place randomly
```

## Contributing

Contributions are welcome!  
If you'd like to improve the simulation, add new patterns, or port the engine to another language, please fork the repository and use a feature branch.

Pull requests are warmly welcome.

You can also contribute by:
- Adding new pattern definitions
- Extending the JS engine with different rule sets
- Improving UI/UX or CSS layout
- Adding new backend implementations

## Links

- Project homepage: [GitHub Pages (when deployed)](https://tizianobarbari.github.io/life-gols/)
- Repository: [https://github.com/tizianobarbari/life-gols](https://github.com/tizianobarbari/life-gols)
- Issue tracker: [https://github.com/tizianobarbari/life-gols/issues](https://github.com/tizianobarbari/life-gols/issues)
  - For sensitive issues or security concerns, please contact the maintainer directly.

Related projects:
- [Conway's Game of Life on Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Life-like cellular automaton](https://en.wikipedia.org/wiki/Life-like_cellular_automaton)

## Licensing

The code in this project is licensed under the **MIT License**.  
See the `LICENSE` file for details.