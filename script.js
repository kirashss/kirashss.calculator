let a = ''; // первое число
let b = ''; // второе число
let sign = ''; // знак операции
let finish = false;

const maxDigits = 9
const digit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const actions = ['+', '-', 'x', '/'];

// экран отображения
const out = document.querySelector('.calc__result p');

// очищение экрана
function clearAll() {
    a = '';
    b = '';
    sign = '';
    finish = false;
    out.textContent = 0;
}

// числа больше 9 символов и дробные 
function formatAndLimitNumber(number) {
    // преобразуем число в строку
    let stringValue = number.toString();

    // проверяем, является ли число десятичным
    const isDecimal = stringValue.includes('.');

    // если число больше 9 символов и не десятичное, экспоненциальная запись
    if (stringValue.length > maxDigits && !isDecimal) {
        return (+stringValue).toExponential(1);
    }

    // если число десятичное, округляем его
    if (isDecimal) {
        const [integerPart, decimalPart] = stringValue.split('.');
        stringValue = `${integerPart}.${decimalPart.slice(0, 2)}`;
    }

    // снова добавляем пробелы
    const digitsWithSpaces = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return digitsWithSpaces;
}

// уменьшение шрифта больших числе, добавление/удаление пробелов для удобства
function checkAndAdjustFont() {
    const inputValue = out.textContent.trim();
    const fontSizeReduction = 2; // значение для уменьшения шрифта

    // если больше 6 символов, уменьшаем шрифт
    if (inputValue.length > 6) {
        const fontSize = parseFloat(window.getComputedStyle(out).fontSize) - fontSizeReduction; // текущий размер шрифта - 2
        out.style.fontSize = fontSize + 'px';
    } else {
        out.style.fontSize = '3.5em';
    }

    const formattedValue = formatAndLimitNumber(inputValue);

    // число отображается с пробелами
    out.textContent = formattedValue;
}

// если нажать на "c", выполняется функция очищения экрана
document.querySelector('.calc__btn_reset').onclick = clearAll;

// если нажать на кнопку
document.querySelector('.calc').onclick = (event) => {
    // нажата НЕ кнопка
    if (!event.target.classList.contains('calc__btn')) return;
    // нажата кнопка "c"
    if (event.target.classList.contains('calc__btn_reset')) return;

    // получаем текстовое содержимое элемента (кнопки) и присваеваем key
    const key = event.target.textContent;

    // если нажать на цифру
    // заносим числа в переменные "a", если "b" и "=" пустые
    if (digit.includes(key)) {
        if (b === '' && sign === '') {
            if (a.length < maxDigits) {
                a += key;
                out.textContent = a
                checkAndAdjustFont();
            }
        }
        // если оба числа занесены И нажали "="
        else if (a !== '' && b !== '' && finish) {
            if (b.length < maxDigits) {
                b = key;
                finish = false;
                out.textContent = b;
                checkAndAdjustFont();
            }
        // заносим числа в переменные "b"
        } else {
            if (b.length < maxDigits) {
                b += key;
                out.textContent = b
                checkAndAdjustFont();
            }
        }
        console.log(a, b, sign);
        return;
    }

    // заносим операцию в переменную "sign"
    if (actions.includes(key)) {
        sign = key;
        out.textContent = sign;
        // checkAndAdjustFont();
        console.log(a, b, sign);
        return;
    }

    // нажали на "=", выполняем операцию, результат записываем в "a"
    if (key === '=') {
        // 2+=4, переменная "b" равняеется переменной "a"
        if (b === '') b = a;

        // ошибка при делении на 0
        if (sign === '/' && parseFloat(b) === 0) {
            out.textContent = "error";
            a = '';
            b = '';
            sign = '';
            return;
        }

        switch (sign) {
            case "+":
                a = (+a) + (+b);
                break;
            case "-":
                a = a - b;
                break;
            case "x":
                a = a * b;
                break;
            case "/":
                a = a / b;
                break;
        }

        finish = true;
        out.textContent = a;
        checkAndAdjustFont();
        console.log(a, b, sign);
    }
};
