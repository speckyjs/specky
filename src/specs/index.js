import S from '../';
import { NamespaceFnSpec, isNamespacePath } from './namespace';

// const S = Specky.withRegistry(nsObj);

S( 'Specky.types.NamespacePath', isNamespacePath );
S( 'Specky', NamespaceFnSpec );

export default S.getRegistry();
