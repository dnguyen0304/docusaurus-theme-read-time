declare module '@theme-init/DocItem/Layout' {
    export interface Props {
        readonly children: JSX.Element;
    }
    export default function DocItemLayout(props: Props): JSX.Element;
}