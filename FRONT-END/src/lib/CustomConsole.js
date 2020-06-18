const ERR_CSS = "background-color:red; color:#ffffff; font-size:23px;";
const CORRECT_CSS = "background-color:green; color:#ffffff; font-size:23px;";

const CustomConsole = {
  error: (value) => {
    console.log(`%c ❌ Server Error::: ${value}`, ERR_CSS);
    console.log(value);
  },
  correct: (title, value) => {
    console.log(
      `%c ⭕  ${title ? title : "정상처리 되었습니다."}::: ${value}`,
      CORRECT_CSS
    );
    console.log(value);
  },
};

export default CustomConsole;
