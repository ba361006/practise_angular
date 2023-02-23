# This guide is based on MacOS, M1 chip

## Get started
1. install npm on your device
2. clone this repo
3. execute `npm install` to install dependencies of this project
4. run the web server by [this](#to-ask-a-web-server-to-serve-this-angular-application)


## Command line
- ng g c <component_name> (npm generate component)
    - ask angular to generate a component, and add the component to declaration in `app.module.ts`

## To ask a web server to serve this angular application:
    1. Via ng serve
        - go to the root directory
        - execute `ng serve --open` in your terminal
        - go to the printed link from your terminal
    2. Via http-server
        - execute `npm install -g http-server` in your terminal
        - execute `ng build` in your terminal
        - go to `./dist` directory
        - execute `http-server -o` in your terminal


## Note
- anchor element: such as `[title]` and `[routerLink]` from the below code
    ``` HTML
    <a 
    [title]="product.name + ' details'"
    [routerLink]="['/products', product.id]">
      {{ product.name}}
    </a>
    ```
    - routerLink: A directive that binds the `<a>` element to a specific route in your Angular application. You can specify the route using a string or an array, and you can also pass additional parameters or query strings.

    - routerLinkActive: A directive that adds a CSS class to the `<a>` element when the corresponding route is active. This can be used to highlight the current page or section in the navigation.

    - (click): An event binding that allows you to perform a function when the `<a>` element is clicked. This can be used to perform custom actions or to prevent the default navigation behavior.

    - [href]: An attribute binding that allows you to dynamically set the URL for the `<a>` element. This can be useful when you need to generate links based on user input or other dynamic data.
    
    - [title]: An attribute binding that allows you to set the tooltip text for the `<a>` element. This can be useful for providing additional information or context about the link.
