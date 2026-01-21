## Development server

To start a local development server, run:

if you are not using pnpm run this command to install pnpm or read https://pnpm.io/installation
```
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

```bash
pnpm i
```
then
```bash
ng serve
```

## Development Approach

During the development of this application, I followed these core principles:

* **Component-Based Architecture:** The user interface is broken down into small, reusable components to ensure modularity and ease of maintenance.
* **Strong Typing:** Leveraged **TypeScript** to define interfaces and types, ensuring code stability, catching errors early during development, and improving IDE support.
* **Clean Code & Best Practices:** Adhered to Angular style guides and clean code principles to ensure the codebase is readable, scalable, and easy to understand.
* **Separation of Concerns:** Clearly separated business logic (Services) from the presentation layer (Components) to keep the application organized.

## Libraries Used

| Library                        | Purpose |
|:-------------------------------| :--- |
| **Angular 21**                 | The primary framework used for building the Single Page Application (SPA). |
| **@ng-bootstrap/ng-bootstrap** | Provides Angular-native Bootstrap components (like modals, datepickers, and tooltips) without relying on jQuery. |
| **@ng-select/ng-select**       | A lightweight and highly customizable select/multiselect component for better user experience. |
| **Bootstrap**                  | Used for the responsive grid system and global CSS styling. |
