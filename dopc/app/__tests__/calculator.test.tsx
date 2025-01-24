import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Calculator from '../calculator'

describe('Delivery Order Price Calculator', () => {
  test('renders Calculator page', () => {
    render(<Calculator />)
    expect(screen.getByText('Delivery Order Price Calculator')).toBeInTheDocument()
    
  })
})