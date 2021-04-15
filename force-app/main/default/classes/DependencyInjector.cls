public with sharing class DependencyInjector {
    //Let's add some comments
    public static Object instantiate(String className) {
        Type t = Type.forName(className);
        return t.newInstance();
    }
}
