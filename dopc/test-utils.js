// https://stackoverflow.com/questions/65518379/react-testing-library-global-configuration

import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-test-id',
});
