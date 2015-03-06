# ChromeIDE
Parallax microcontroller development environment based on Chrome application technologies.

## Build from Source

This is a one-time procedure needed to initially run the application.  To build the application will need the Node javascript library.  If you don't have it, then:

1. Install Node by going to [nodejs.org/download](https://nodejs.org/download/) and selecting the option that is right for your system.

1. Clone this respository.  Assuming you have `git` installed (if not, [go here](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)), choose your file destination from the command-line (CLI like Terminal), and

  ``` git clone git@github.com:parallaxinc/ChromeIDE ```

  ![clone repo](readme-images/clone-chromeIDE.png)

1. Go to the project root directory with

  ``` cd  ChromeIDE/ ```

1. Get all the project dependencies

  ``` npm install ```

1. Bundle and build the application by entering

  ```npm run build```


## Installing in Chrome

1. Open your Chrome browser and navigate to

	``` chrome://extensions ```

1. Enable 'Developer Mode' by clicking the checkbox.

  ![enable developer mode](readme-images/enable-developer-mode.png)

1. Before you install your extension must be bundled and built.  If you haven't done so follow the instructions in the [Build from Source](#user-content-build-from-source) section first.

1. Click on __'Load unpacked extensions...'__, go to the directory where ChromeIDE was built, highlight the *'ChromeIDE'* folder and and click select.

	![load extension](readme-images/load-unpacked-extensions.png)
	![select folder](readme-images/select-extension-folder.png)

1. Return to the ``` chrome://extensions ``` page and you should see __'Parallax Chrome IDE'__ listed in available extensions.

	![chromeIDE listed](readme-images/chromeIDE-listed.png)
1. Ensure the checkbox is *'enabled'* and click __'launch'__.
1. __Congratulations!__ You just launched ChromeIDE which will look something like this:

	![app launched](readme-images/chromeIDE-launched.png)
