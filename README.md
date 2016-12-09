# Slush Atom [![Build Status](https://secure.travis-ci.org/carlospicart/slush-atom.png?branch=master)](https://travis-ci.org/carlospicart/slush-atom) [![NPM version](https://badge-me.herokuapp.com/api/npm/slush-atom.png)](http://badges.enytc.com/for/npm/slush-atom)

> Generator to scaffold an atom and corresponding scss in Pattern Lab


## Getting Started

Install `slush-atom` globally:

```bash
$ npm install -g slush-atom
```

### Usage

Create a new atom for your Pattern Lab:

```bash
$ slush atom
```

You will be prompted for several things including the name of your atom. Your answers will dictate how items get scaffolded into Pattern Lab.

Command to see which generators are installed:

```bash
$ slush
```

Uninstall Slush Molecule:
```bash
$ sudo npm uninstall slush-atom -g
```

#### Configuring your Slush Atom

You can configure filepaths and templates used by adding a `slush-atom-config.json` file in the same place that you run the `slush atom` command from.
The default configuration is included in this project.  Your local configuration will override and merge with that file.  See below for an explaination of each value:
```json
{
	"mustacheOutputPath": "the path of the folder with the mustache file in it gets placed",
	"mustacheFile": {
		"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
		"template": "the path to the template to be used for the mustache file when data file is NOT requested"
	},
	"scssFileOutputPath": "the path of the folder with the scss files in it gets placed",
	"scssNamespaceConnector": "The character(s) to connect the name of the scss file with the name of the breakpoint (e.g. \"-\" for scssFileName-bpName.scss)",
	"scssFiles": [
		{
			"name": "name of the breakpoint",
			"includedFromFile": "the file that this breakpoint file is imported from",
			"scssImportPath": "the path from the importing file to the newly generated file",
			"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
			"template": "the path to the template to be used for the scss file for this breakpoint",
			"importReplace": "false if the import code should simply be appended, otherwise provide a placeholder that the import code should prepend"
		},{
			"name": "name of the breakpoint",
			"includedFromFile": "the file that this breakpoint file is imported from",
			"scssImportPath": "the path from the importing file to the newly generated file",
			"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
			"template": "the path to the template to be used for the scss file for this breakpoint",
			"importReplace": "false if the import code should simply be appended, otherwise provide a placeholder that the import code should prepend"
		}
	]
}
```

## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/slushjs/slush).

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/carlospicart/slush-atom/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/carlospicart/slush-atom/issues).

## License 

Unlicensed

Copyright (c) 2016, Carlos Picart

