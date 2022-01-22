<p align="center">
  <img height="140" src="media/demodal.png" alt="Demodal Banner" align="center" />
</p>

<br />

<div align="center"><strong>Promise-based utility to control modal states in React</strong></div>
<div align="center">Zero-dependency library that easily integrates with your existing UI components and allows you to naturally use modals in React</div>

<br />

<div align="center">

[![GitHub Actions](https://img.shields.io/github/workflow/status/thiagozf/demodal/demodal%20tests?style=for-the-badge&labelColor=4147dc&logo=github&logoColor=white)](https://github.com/thiagozf/demodal/actions?query=workflow%3A%22demodal+tests%22)
[![Coverage](https://img.shields.io/codecov/c/gh/thiagozf/demodal?style=for-the-badge&labelColor=4147dc&logo=codecov&logoColor=white)](https://app.codecov.io/gh/thiagozf/demodal/)
[![NPM bundle size](https://img.shields.io/bundlephobia/minzip/demodal?style=for-the-badge&labelColor=4147dc&logoColor=white)](https://www.npmjs.com/package/demodal)
[![Twitter Badge](https://img.shields.io/badge/%23Demodal-4147dc?style=for-the-badge&labelColor=4147dc&logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?url=https://github.com/thiagozf/demodal&text=Promise-based%20utility%20to%20control%20modal%20states%20in%20React!&hashtags=react,demodal)

</div>

<br/>

## Quick Features

- **Promise based**: open your modal with a simple function call and `await` for the result.
- **Uncontrolled**: open/close your modal from anywhere in the code (even inside the modal itself).
- **Decoupled**: no need to import a modal component to use it. Modals can be managed by ID.
- **Tiny**: zero-dependency to keep your bundle size under control: `~1.5kB`.
- **Easy integration**: easily integrate with any UI library.
- **Lazy-loading**: delay the rendering of your modal component until it's open.

## Examples

Try it on CodeSandbox or browse the [examples folder](https://github.com/thiagozf/demodal/tree/main/examples).

[![Demodal Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/thiagozf/demodal/tree/main/examples/basic)

## Basic Usage

```jsx
import Demodal from 'demodal'
import MyModal from './MyModal'

// ...
const result = await Demodal.open(MyModal, { myModalProp: 'value' })
// Do something with result
```

## Use-Case: Confirmation Modal

```jsx
/**
 * confirm.js
 */
import { Demodal, useModal } from 'demodal'

// Register your Confirm modal wrapping it with `Demodal.create`
const Confirm = Demodal.create(
  ({ title = 'Confirmation', message = 'Do you confirm this action?' }) => {
    // useModal hook to control UI components
    const modal = useModal()

    // Once resolved, automatically close the modal
    const resolve = value => () => {
      modal.resolve(value)
      modal.close()
    }

    // "title" and "message" are props sent with "modal.open()"
    return (
      <Modal open={modal.isOpen} onClose={modal.close} onExited={modal.remove}>
        <div>{title}</div>
        <div>{body}</div>
        <Button onClick={resolve(true)}>Yes</Button>
        <Button onClick={resolve(false)}>No</Button>
      </Modal>
    )
  }
)

// Create a custom confirm function
export const confirm = props => Demodal.open(Confirm, props)

/**
 * page.js
 */
import { confirm } from './confirm'

export const Page = () => {
  const handleClick = async () => {
    const confirmed = await confirm({
      title: 'Are you sure?',
      message: 'This action is irreversible',
    })
    console.log(confirmed)
  }

  return <Button onClick={handleClick}>Action</Button>
}

/**
 * app.js
 */
import { Demodal } from 'demodal'

function App() {
  // Remember to wrap your app with Demodal.Provider
  return (
    <Demodal.Provider>
      <Page />
    </Demodal.Provider>
  )
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/thiagozf"><img src="https://avatars.githubusercontent.com/u/4684137?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Thiago Zanivan</b></sub></a><br /><a href="https://github.com/thiagozf/demodal/commits?author=thiagozf" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
