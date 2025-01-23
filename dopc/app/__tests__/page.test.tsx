import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../page'

describe('Delivery Order Price Calculator', () => {
  test('renders Home page', () => {
    render(<Page />)
    expect(screen.getByText('Delivery Order Price Calculator')).toBeInTheDocument()
    
  })
})