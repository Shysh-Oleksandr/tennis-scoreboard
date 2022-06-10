import { createGlobalStyle } from "styled-components";
import { ThemeType } from "./Themes";

export const GlobalStyles = createGlobalStyle<{ theme: ThemeType }>`
  body {
    background: ${({ theme }) => theme.body} !important;
  }


  `;
