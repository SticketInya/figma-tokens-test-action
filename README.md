# figma-tokens-test-action

## Goal

We would like to have an automated workflow where the designer updates the design, the token changes are pushed to github (with the help of [Figma-Tokens](<https://www.figma.com/community/plugin/843461159747178978/Tokens-Studio-for-Figma-(Figma-Tokens)>)) and an action generates the css variables from the tokens, then updates the codebase.

## Tools used

For ease of use, the code is built with [@vercel/ncc](https://github.com/vercel/ncc) into a single file, which is then used by the action.

```bash
ncc build src/index.js
```

[More information about creating Github actions.](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#introduction)

## How to use

An example workflow can be found in the repository under the `/examples` directory.

First we need to checkout our current repository. Then generate the css with the help of this action.

```yml
 - name: Generate CSS
        uses: SticketInya/figma-tokens-test-action@v0.1 # The path to the repository which the script resides in. If it is not tagged with a version or a release, you can also specify a branch or a commit after the '@' sign
        with:
          destination: './generated-colors.scss'
          base-selector: '.base_colors'
          source: "./tokens.json"
```

This script creates the formatted file in the destination provided. The next step is to commit the changes. Be careful to only include files in the commit, you actually want to use.

```yml
- name: Commit changes
        run: |
          git config --global user.name 'JPatrik'
          git config --global user.email 'patrik.jokhel@dakai.io'
          git add ./generated-colors.scss
          git commit -am "auto: Re-generate colors"
```

With the changes committed, you can either `push` them to a `branch` or create a `pull request`.

```yml
  - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          base: main
          branch: colors-bump
          title: '[Automated] Update generated colors'
          assignees: SticketInya
```

If you want to initiate workflows based on the created pull request, you need to provide a [Personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) to the workflow.
