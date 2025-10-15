/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import './globals.css';
import {
	calculateExpressionDecimal,
	calculateString,
	validateExpression,
	validateRegexString,
} from './stringCalculator';

const App = () => {
	const [stringCalculator, setStringCalculator] = useState('');
	const [result, setResult] = useState<number | null>(null);
	const [warningText, setWarningText] = useState('');

	const handleCalculateSubmit = (event: any) => {
		if (event) event.preventDefault();
		setResult(null);
		if (!stringCalculator) {
			setWarningText('Please fill the field');
			return;
		}
		if (
			!validateRegexString(stringCalculator) &&
			calculateExpressionDecimal(stringCalculator) === null
		) {
			setWarningText('Please enter a valid numbers with operators(+, -, *, /)');
			return;
		}
		if (!validateExpression(stringCalculator)) {
			setWarningText('Invalid Parentheses');
			return;
		}

		const calculatedValue = calculateString(stringCalculator);
		setResult(calculatedValue);
		setWarningText('');
	};

	return (
		<div className="app-container">
			<div className="card_container">
				<img
					src="https://images.unsplash.com/photo-1594352161389-11756265d1b5?q=80&w=800&auto=format&fit=crop"
					alt="Calculator Banner"
					className="image_style"
				/>

				<h2 className="card_heading_style">String Calculator</h2>
				<form
					aria-label="string-calculator-form"
					onSubmit={handleCalculateSubmit}
				>
					<div className="content_container">
						<div className="input_container">
							<label htmlFor="string_calculator" className="label_style">
								Enter numbers
							</label>
							<textarea
								id="string_calculator"
								rows={2}
								className="textarea_style"
								placeholder="enter here"
								value={stringCalculator}
								onChange={e => {
									if (e.target.value !== '') {
										setStringCalculator(e.target.value);
									} else {
										setStringCalculator('');
										setResult(null);
										setWarningText('');
									}
								}}
								aria-required="true"
								required
							/>
						</div>
						<button type="submit" className="primary_button_style">
							Calculate
						</button>
					</div>
					{result !== null && (
						<p className="result_test_style">Result: {result}</p>
					)}
					{!warningText ? null : (
						<div role="alert" className="warning_text_style">
							{warningText}
						</div>
					)}
					<div
						className="info-section"
						style={{
							width: '100%',
							justifyItems: 'flex-start',
						}}
					>
						<h3>Info</h3>
						<p>
							• Use <b>numbers</b> and basic operators <b>( +, -, *, / )</b>.
						</p>
						<p>
							• You can include <b>parentheses</b> to group operations.
						</p>
						<p>
							• Avoid using <b>letters</b> or <b>special symbols</b>.
						</p>
						<p
							style={{
								color: 'var(--primary-success-text-color)',
								fontWeight: '600',
							}}
						>
							• Example syntax do: <b>(2 + 3) * 4 or (4+5) * (5-2)</b>
						</p>
						<p
							style={{
								color: 'var(--primary-warning-text-color)',
								fontWeight: '600',
							}}
						>
							• Example syntax don't: <b>(a + 4c) / 2 or 2 * b</b>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default App;
