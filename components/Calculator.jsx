'use client';
import { useState, useEffect } from 'react';
import { evaluate, parse } from 'mathjs';
import { CalculatorIcon, BackspaceIcon } from '@heroicons/react/24/outline';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const buttons = [
    { value: 'C', type: 'clear' },
    { value: '(', type: 'operator' },
    { value: ')', type: 'operator' },
    { value: '^', type: 'operator' },
    { value: '7', type: 'number' },
    { value: '8', type: 'number' },
    { value: '9', type: 'number' },
    { value: '/', type: 'operator' },
    { value: '4', type: 'number' },
    { value: '5', type: 'number' },
    { value: '6', type: 'number' },
    { value: '*', type: 'operator' },
    { value: '1', type: 'number' },
    { value: '2', type: 'number' },
    { value: '3', type: 'number' },
    { value: '-', type: 'operator' },
    { value: '0', type: 'number' },
    { value: '.', type: 'decimal' },
    { value: '=', type: 'equals' },
    { value: '+', type: 'operator' },
  ];

  const scientificButtons = [
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: '√', value: 'sqrt(' },
    { label: 'log', value: 'log(' },
    { label: 'π', value: 'pi' },
  ];

  const calculateSteps = (expression) => {
    try {
      const node = parse(expression);
      const stepsArray = [];
      
      node.traverse((node, path, parent) => {
        if (node.isOperatorNode || node.isFunctionNode) {
          const subExpr = node.toString();
          const result = evaluate(subExpr);
          stepsArray.push({
            expression: subExpr,
            result: Number(result.toFixed(4))
          });
        }
      });

      const finalResult = evaluate(expression);
      stepsArray.push({
        expression: expression,
        result: Number(finalResult.toFixed(4))
      });

      return stepsArray;
    } catch (err) {
      setError('Invalid mathematical expression');
      return null;
    }
  };

  const handleInput = (value) => {
    setError('');
    if (value === 'C') {
      setInput('');
      setSteps([]);
    } else if (value === '=') {
      try {
        const calculationSteps = calculateSteps(input);
        if (calculationSteps) {
          setSteps(calculationSteps);
          setHistory(prev => [
            { expression: input, result: calculationSteps.slice(-1)[0].result },
            ...prev.slice(0, 4)
          ]);
          setInput(calculationSteps.slice(-1)[0].result.toString());
        }
      } catch (err) {
        setError('Invalid calculation');
      }
    } else {
      setInput(prev => prev + value);
    }
  };

  const handleKeyboardInput = (e) => {
    if (e.key >= '0' && e.key <= '9' || '+-*/.()^'.includes(e.key)) {
      handleInput(e.key);
    } else if (e.key === 'Enter') {
      handleInput('=');
    } else if (e.key === 'Backspace') {
      setInput(prev => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardInput);
    return () => window.removeEventListener('keydown', handleKeyboardInput);
  }, [input]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-calc-dark rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <CalculatorIcon className="h-8 w-8 text-calc-primary" />
        <h1 className="text-2xl font-bold text-white">Advanced Calculator</h1>
      </div>

      {/* Display */}
      <div className="mb-4 p-4 bg-black rounded-lg text-right">
        <div className="text-3xl font-mono text-white min-h-[2rem]">
          {error || input || '0'}
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Scientific Functions */}
        {scientificButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleInput(btn.value)}
            className="p-3 bg-calc-button text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {btn.label}
          </button>
        ))}

        {/* Main Buttons */}
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleInput(btn.value)}
            className={`p-3 text-white rounded-lg transition-colors ${
              btn.type === 'operator' ? 'bg-calc-button hover:bg-gray-600' :
              btn.type === 'equals' ? 'bg-calc-primary hover:bg-blue-600' :
              'bg-calc-button hover:bg-gray-600'
            }`}
          >
            {btn.value}
          </button>
        ))}

        {/* Backspace Button */}
        <button
          onClick={() => setInput(prev => prev.slice(0, -1))}
          className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
        >
          <BackspaceIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Step-by-Step Solutions */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Calculation Steps:</h3>
        {steps.map((step, index) => (
          <div key={index} className="mb-2 p-3 bg-calc-button rounded-lg">
            <span className="text-gray-300">{step.expression} = </span>
            <span className="text-white font-bold">{step.result}</span>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Calculations:</h3>
        {history.map((item, index) => (
          <div key={index} className="mb-2 p-3 bg-calc-button rounded-lg">
            <span className="text-gray-300">{item.expression} = </span>
            <span className="text-white font-bold">{item.result}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculator;